'use client';

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://efv-b.onrender.com/api';

// Get auth token from localStorage
const getAuthHeader = () => {
    const user = localStorage.getItem('efv_auth_user');
    if (user) {
        const { token } = JSON.parse(user);
        return { Authorization: `Bearer ${token}` };
    }
    return {};
};

export const api = {
    // Auth
    login: (email: string, password: string) =>
        axios.post(`${API_URL}/auth/login`, { email, password }),

    signup: (name: string, email: string, password: string) =>
        axios.post(`${API_URL}/auth/signup`, { name, email, password }),

    // Products
    getProducts: () =>
        axios.get(`${API_URL}/products`),

    getProduct: (id: string) =>
        axios.get(`${API_URL}/products/${id}`),

    // Demo Mode
    addToLibrary: (productId: string) =>
        axios.post(`${API_URL}/demo/add-to-library`, { productId }, {
            headers: getAuthHeader()
        }),

    // Library
    getMyLibrary: () =>
        axios.get(`${API_URL}/library/my-library`, {
            headers: getAuthHeader()
        }),

    getLibraryCount: () =>
        axios.get(`${API_URL}/demo/library-count`, {
            headers: getAuthHeader()
        }),

    // Progress
    getProgress: (productId: string) =>
        axios.get(`${API_URL}/library/progress/${productId}`, {
            headers: getAuthHeader()
        }),

    saveProgress: (productId: string, progress: number, total: number) =>
        axios.post(`${API_URL}/library/progress`, { productId, progress, total }, {
            headers: getAuthHeader()
        }),

    // Content Streaming
    getEbookUrl: (productId: string) =>
        `${API_URL}/content/ebook/${productId}`,

    getAudioUrl: (productId: string) =>
        `${API_URL}/content/audio/${productId}`,
};
