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

const ComponentesUI = ({ panelWidth, selectedCategory, isEditMode }) => {
  const getColumnClass = () => {
    if (panelWidth < 400) return 'grid-cols-1';
    if (panelWidth < 600) return 'grid-cols-2';
    if (panelWidth < 800) return 'grid-cols-3';
    return 'grid-cols-4';
  };

  const renderComponent = () => {
    switch (selectedCategory) {
      case 'Sidebars':
        return <Sidebars />;
      case 'Top Bars (Navigation Bars)':
        return <TopBars />;
      case 'Buttons':
        return <Buttons />;
      case 'Cards':
        return <Cards />;
      case 'Dialogs/Modals':
        return <Dialogs />;
      case 'Tables':
        return <div className="h-full overflow-hidden"><Tables /></div>;
      case 'Forms':
        return <Forms />;
      case 'Typography':
        return <Typography />;
      case 'Icons and Illustrations':
        return <IconsAndIllustrations />;
      case 'Notifications and Toasts':
        return <Notifications />;
      default:
        return <PreviewCards isEditMode={isEditMode} />;
    }
  };

  return (
    <div className={`h-full ${selectedCategory === 'Tables' ? '' : `grid gap-4 ${getColumnClass()}`}`}>
      {renderComponent()}
    </div>
  );
};

export default ComponentesUI;