import React from 'react';
import Navigation from '../components/Navigation';
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

const ComponentesUI = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Catálogo de Componentes UI</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Sidebars</h2>
          <Sidebars />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Top Bars (Navigation Bars)</h2>
          <TopBars />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
          <Buttons />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Cards</h2>
          <Cards />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Dialogs/Modals</h2>
          <Dialogs />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Tables</h2>
          <Tables />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Forms</h2>
          <Forms />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Typography</h2>
          <Typography />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Icons and Illustrations</h2>
          <IconsAndIllustrations />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Notifications and Toasts</h2>
          <Notifications />
        </section>
      </div>
    </div>
  );
};

export default ComponentesUI;