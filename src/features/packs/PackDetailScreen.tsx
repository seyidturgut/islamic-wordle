import React from 'react';
import { useSettings } from '../../hooks/useSettings.ts';

const PackDetailScreen: React.FC = () => {
    const { t } = useSettings();
    return <div>{t('packDetails')}</div>;
};

export default PackDetailScreen;
