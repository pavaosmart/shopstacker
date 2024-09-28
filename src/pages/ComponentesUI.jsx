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

const ComponentesUI = ({ panelWidth, selectedCategory, isEditMode }) => {
  const renderComponent = () => {
    switch (selectedCategory) {
      case 'Dialog Confirmations':
        return <Dialogs />;
      case 'Top Bars (Navigation Bars)':
        return <TopBars />;
      case 'Buttons':
        return <Buttons />;
      case 'Cards':
        return <Cards />;
      case 'Dialogs/Modals':
        return <Dialogs />;
      case 'Tables':
        return <Tables />;
      case 'Forms':
        return <Forms />;
      case 'Typography':
        return <Typography />;
      case 'Icons and Illustrations':
        return <IconsAndIllustrations />;
      case 'Notifications and Toasts':
        return <Notifications />;
      default:
        return <div>Select a category to view components</div>;
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {renderComponent()}
    </div>
  );
};

export default ComponentesUI;