
import React from 'react';
import { useSettings } from '../../hooks/useSettings.ts';

const ConfirmationModal: React.FC = () => {
    // FIX: The `useSettings` hook now provides the `t` function.
    const { t } = useSettings();
    return <div>{t('areYouSure')}</div>;
};

export default ConfirmationModal;