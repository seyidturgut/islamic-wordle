
import React from 'react';
import { useSettings } from '../../hooks/useSettings.ts';

const CreatePackModal: React.FC = () => {
    // FIX: The `useSettings` hook now provides the `t` function.
    const { t } = useSettings();
    return <div>{t('createPack')}</div>;
};

export default CreatePackModal;