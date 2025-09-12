import React from 'react';
import { useSettings } from '../../hooks/useSettings.ts';

const ConfirmationModal: React.FC = () => {
    const { t } = useSettings();
    return <div>{t('areYouSure')}</div>;
};

export default ConfirmationModal;
