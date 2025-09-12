
import React from 'react';
import { useSettings } from '../../hooks/useSettings.ts';

const PackDetailScreen: React.FC = () => {
    // FIX: The `useSettings` hook now provides the `t` function.
    const { t } = useSettings();
    return <div>{t('packDetails')}</div>;
};

export default PackDetailScreen;