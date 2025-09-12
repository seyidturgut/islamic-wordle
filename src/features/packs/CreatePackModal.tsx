import React from 'react';
import { useSettings } from '../../hooks/useSettings.ts';

const CreatePackModal: React.FC = () => {
    const { t } = useSettings();
    return <div>{t('createPack')}</div>;
};

export default CreatePackModal;
