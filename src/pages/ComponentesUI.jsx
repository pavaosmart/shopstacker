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

const ComponentesUI = ({ panelWidth, selectedCategory, isEditMode, onComponentClick }) => {
  const renderComponent = () => {
    switch (selectedCategory) {
      case 'Sidebars':
        return <Sidebars onComponentClick={onComponentClick} />;
      case 'Top Bars (Navigation Bars)':
        return <TopBars onComponentClick={onComponentClick} />;
      case 'Buttons':
        return <Buttons onComponentClick={onComponentClick} />;
      case 'Cards':
        return <Cards onComponentClick={onComponentClick} />;
      case 'Dialogs/Modals':
        return <Dialogs onComponentClick={onComponentClick} />;
      case 'Tables':
        return <Tables onComponentClick={onComponentClick} />;
      case 'Forms':
        return <Forms onComponentClick={onComponentClick} />;
      case 'Typography':
        return <Typography onComponentClick={onComponentClick} />;
      case 'Icons and Illustrations':
        return <IconsAndIllustrations onComponentClick={onComponentClick} />;
      case 'Notifications and Toasts':
        return <Notifications onComponentClick={onComponentClick} />;
      default:
        return <PreviewCards isEditMode={isEditMode} onComponentClick={onComponentClick} />;
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {renderComponent()}
    </div>
  );
};

export default ComponentesUI;