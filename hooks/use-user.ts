'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface UserData {
  id: string;
  telegramId: string;
  username: string;
  balance: number;
  miningBalance: number;
  worldcoinVerified: boolean;
  worldcoinAddress?: string;
  miningPower: number;
  miningLevel: number;
  createdAt: string;
  lastMiningUpdate?: string;
}

export function useUser() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const syncTimeoutRef = useRef<NodeJS.Timeout>();

  // Initialize user on mount
  useEffect(() => {
    const initializeUser = async () => {
      try {
        setLoading(true);

        if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initData) {
          const telegramId =
            (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() ||
            `tg_${Date.now()}`;
          const username =
            (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.username || 'Usuario';

          // Try to fetch from Supabase
          try {
            const response = await fetch(`/api/user/get?telegramId=${telegramId}`);

            if (response.ok) {
              const userData = await response.json();
              setUser(userData);
            } else {
              // User doesn't exist, create new with balance = 0
              const createResponse = await fetch('/api/user/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  telegramId,
                  username,
                }),
              });

              if (createResponse.ok) {
                const newUser = await createResponse.json();
                setUser(newUser);
              } else {
                throw new Error('Failed to create user');
              }
            }
          } catch (err) {
            console.log('[v0] Supabase not available, using local storage fallback');

            // Fallback: localStorage
            const storedUser = localStorage.getItem(`user_${telegramId}`);

            if (storedUser) {
              setUser(JSON.parse(storedUser));
            } else {
              const newUser: UserData = {
                id: `user_${Date.now()}`,
                telegramId,
                username,
                balance: 0,
                miningBalance: 0,
                worldcoinVerified: false,
                miningPower: 1,
                miningLevel: 1,
                createdAt: new Date().toISOString(),
              };

              localStorage.setItem(`user_${telegramId}`, JSON.stringify(newUser));
              setUser(newUser);
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error initializing user');
      } finally {
        setLoading(false);
      }
    };

    initializeUser();

    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, []);

  // Sync user data periodically
  const syncUser = useCallback(async () => {
    if (!user?.telegramId) return;

    try {
      const response = await fetch(`/api/user/get?telegramId=${user.telegramId}`);
      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
      }
    } catch (err) {
      console.log('[v0] Sync failed, using local state');
    }
  }, [user?.telegramId]);

  // Update balance (wallet)
  const updateBalance = useCallback(
    async (amount: number) => {
      if (!user) return;

      const newBalance = user.balance + amount;

      // Optimistic update
      setUser(prev => (prev ? { ...prev, balance: newBalance } : null));

      // Sync to backend
      try {
        await fetch('/api/user/update-balance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            telegramId: user.telegramId,
            balance: newBalance,
          }),
        });
      } catch (err) {
        console.log('[v0] Balance update failed, using local state');
        // Save to localStorage as backup
        localStorage.setItem(`user_${user.telegramId}`, JSON.stringify({ ...user, balance: newBalance }));
      }
    },
    [user]
  );

  // Update mining balance and sync with wallet
  const updateMiningBalance = useCallback(
    async (amount: number) => {
      if (!user) return;

      const newBalance = user.balance + amount;
      const newMiningBalance = user.miningBalance + amount;

      // Optimistic update
      setUser(prev =>
        prev
          ? {
              ...prev,
              balance: newBalance,
              miningBalance: newMiningBalance,
              lastMiningUpdate: new Date().toISOString(),
            }
          : null
      );

      // Sync to backend
      try {
        await fetch('/api/user/update-mining', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            telegramId: user.telegramId,
            balance: newBalance,
            miningBalance: newMiningBalance,
          }),
        });
      } catch (err) {
        console.log('[v0] Mining update failed, using local state');
        localStorage.setItem(
          `user_${user.telegramId}`,
          JSON.stringify({ ...user, balance: newBalance, miningBalance: newMiningBalance })
        );
      }
    },
    [user]
  );

  // Upgrade mining (requires WLD/balance payment)
  const upgradeMining = useCallback(
    async (cost: number) => {
      if (!user || user.balance < cost) {
        setError('Saldo insuficiente');
        return;
      }

      const newBalance = user.balance - cost;
      const newLevel = user.miningLevel + 1;
      const newPower = user.miningPower * 2;

      // Optimistic update
      setUser(prev =>
        prev
          ? {
              ...prev,
              balance: newBalance,
              miningLevel: newLevel,
              miningPower: newPower,
            }
          : null
      );

      // Sync to backend
      try {
        await fetch('/api/user/upgrade-mining', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            telegramId: user.telegramId,
            cost,
          }),
        });
      } catch (err) {
        console.log('[v0] Upgrade failed, reverting...');
        setUser(user);
        setError('Error al mejorar minería');
      }
    },
    [user]
  );

  // Set Worldcoin verification
  const setWorldcoinVerified = useCallback(
    async (address: string) => {
      if (!user) return;

      // Optimistic update
      setUser(prev => (prev ? { ...prev, worldcoinVerified: true, worldcoinAddress: address } : null));

      // Sync to backend
      try {
        await fetch('/api/user/verify-worldcoin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            telegramId: user.telegramId,
            worldcoinAddress: address,
          }),
        });
      } catch (err) {
        console.log('[v0] Worldcoin verification failed');
        localStorage.setItem(
          `user_${user.telegramId}`,
          JSON.stringify({ ...user, worldcoinVerified: true, worldcoinAddress: address })
        );
      }
    },
    [user]
  );

  return {
    user,
    loading,
    error,
    updateBalance,
    updateMiningBalance,
    upgradeMining,
    setWorldcoinVerified,
    syncUser,
  };
}
