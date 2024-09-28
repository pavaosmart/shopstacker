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

const ComponentesUI = ({ panelWidth }) => {
  const getColumnClass = () => {
    if (panelWidth < 400) return 'grid-cols-1';
    if (panelWidth < 600) return 'grid-cols-2';
    if (panelWidth < 800) return 'grid-cols-3';
    return 'grid-cols-4';
  };

  return (
    <div className={`grid gap-4 ${getColumnClass()}`}>
      <section>
        <h2 className="text-xl font-semibold mb-4">Sidebars</h2>
        <Sidebars />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Top Bars</h2>
        <TopBars />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Buttons</h2>
        <Buttons />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Cards</h2>
        <Cards />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Dialogs/Modals</h2>
        <Dialogs />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Tables</h2>
        <Tables />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Forms</h2>
        <Forms />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Typography</h2>
        <Typography />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Icons and Illustrations</h2>
        <IconsAndIllustrations />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Notifications and Toasts</h2>
        <Notifications />
      </section>
    </div>
  );
};

export default ComponentesUI;