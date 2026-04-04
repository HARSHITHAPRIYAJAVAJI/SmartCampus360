import api from './api';

export interface Notification {
    id: number;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'destructive';
    target_audience: 'all' | 'students' | 'faculty' | 'staff' | 'specific';
    target_uids?: number[];
    status: 'sent' | 'draft' | 'scheduled';
    created_at: string;
}

const notificationService = {
    getNotifications: async (): Promise<Notification[]> => {
        const response = await api.get('/notifications/');
        return response.data;
    },

    createNotification: async (data: Partial<Notification>): Promise<Notification> => {
        const response = await api.post('/notifications/', data);
        return response.data;
    },

    deleteNotification: async (id: number): Promise<void> => {
        await api.delete(`/notifications/${id}`);
    },

    registerDevice: async (token: string): Promise<void> => {
        await api.post('/notifications/register-device', {
            fcm_token: token,
            device_type: 'web'
        });
    }
};

export default notificationService;
