import type { Preview } from '@storybook/react-vite';

import { TooltipProvider } from '../src/components/tooltip/tooltip';
import '../src/styles.css';

const preview: Preview = {
  parameters: {
    layout: 'padded',
    controls: { expanded: true },
    a11y: { test: 'error' },
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
};

export default preview;
