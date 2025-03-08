import { useState } from 'react';

export const useApiError = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [errorDetails, setErrorDetails] = useState<{
        statusCode?: number;
        message?: string;
    }>({});

    const showError = (statusCode?: number, message?: string) => {
        setErrorDetails({ statusCode, message });
        setIsModalVisible(true);
    };

    const hideError = () => {
        setIsModalVisible(false);
        setErrorDetails({});
    };

    return {
        isModalVisible,
        errorDetails,
        showError,
        hideError,
    };
}; 