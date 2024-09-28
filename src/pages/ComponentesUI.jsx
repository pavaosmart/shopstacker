import React from 'react';
import Sidebars from '../components/ui-catalog/Sidebars';
import TopBars from '../components/ui-catalog/TopBars';
import Buttons from '../components/ui-catalog/Buttons';
import Cards from '../components/ui-catalog/Cards';
import Dialogs from '../components/ui-catalog/Dialogs';
import Tables from '../components/ui-catalog/Tables';
import Forms from '../components/ui-catalog/Forms';
import Typography from '../components/ui-catalog/Typography';
import IconsAndIllustrations from '../components/ui-catalog/IconsAndIllustrations';
import Notifications from '../components/ui-catalog/Notifications';
import PreviewCards from '../components/ui-catalog/PreviewCards';

const ComponentesUI = ({ panelWidth, selectedCategory, isEditMode, onComponentClick, onImplementComponent }) => {
  const renderComponent = () => {
    switch (selectedCategory) {
      case 'Sidebars':
        return <Sidebars onComponentClick={onComponentClick} onImplementComponent={onImplementComponent} />;
      case 'Top Bars (Navigation Bars)':
        return <TopBars onComponentClick={onComponentClick} onImplementComponent={onImplementComponent} />;
      case 'Buttons':
        return <Buttons onComponentClick={onComponentClick} onImplementComponent={onImplementComponent} />;
      case 'Cards':
        return <Cards onComponentClick={onComponentClick} onImplementComponent={onImplementComponent} />;
      case 'Dialogs/Modals':
        return <Dialogs onComponentClick={onComponentClick} onImplementComponent={onImplementComponent} />;
      case 'Tables':
        return <Tables onComponentClick={onComponentClick} onImplementComponent={onImplementComponent} />;
      case 'Forms':
        return <Forms onComponentClick={onComponentClick} onImplementComponent={onImplementComponent} />;
      case 'Typography':
        return <Typography onComponentClick={onComponentClick} onImplementComponent={onImplementComponent} />;
      case 'Icons and Illustrations':
        return <IconsAndIllustrations onComponentClick={onComponentClick} onImplementComponent={onImplementComponent} />;
      case 'Notifications and Toasts':
        return <Notifications onComponentClick={onComponentClick} onImplementComponent={onImplementComponent} />;
      default:
        return <PreviewCards isEditMode={isEditMode} onComponentClick={onComponentClick} onImplementComponent={onImplementComponent} />;
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {renderComponent()}
    </div>
  );
};

export default ComponentesUI;