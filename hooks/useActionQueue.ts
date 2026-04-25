import { useState, useEffect, useCallback } from 'react';
import { ActionQueueItem } from '../types';

export const useActionQueue = () => {
    const [queue, setQueue] = useState<ActionQueueItem[]>([]);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const addToQueue = useCallback((item: Omit<ActionQueueItem, 'id' | 'retryCount'>) => {
        const newItem: ActionQueueItem = {
            ...item,
            id: Math.random().toString(36).substr(2, 9),
            retryCount: 0
        };
        setQueue(prev => [...prev, newItem]);
        // Implementation note: In a real app, save this to LocalStorage
        return newItem.id;
    }, []);

    const processQueue = useCallback(async (processor: (item: ActionQueueItem) => Promise<void>) => {
        if (isOffline || queue.length === 0) return;

        const currentQueue = [...queue];
        setQueue([]); // Clear for fresh start

        for (const item of currentQueue) {
            try {
                await processor(item);
            } catch (error) {
                console.error(`Failed to sync item ${item.id}:`, error);
                if (item.retryCount < 3) {
                    setQueue(prev => [...prev, { ...item, retryCount: item.retryCount + 1 }]);
                }
            }
        }
    }, [isOffline, queue]);

    return { queue, isOffline, addToQueue, processQueue };
};
