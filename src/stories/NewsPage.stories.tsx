import { ComponentStory, ComponentMeta } from '@storybook/react';
import { NewsPage } from 'pages';
import { withRouter } from 'storybook-addon-react-router-v6';

export default {
  title: 'Pages/NewsPage',
  component: NewsPage,
  decorators: [withRouter],
} as ComponentMeta<typeof NewsPage>;

const Template: ComponentStory<typeof NewsPage> = () => (
  <div
    style={{
      width: '100%',
      maxWidth: '550px',
      margin: '0 auto',
    }}
  >
    <NewsPage />
  </div>
);

export const Default = Template.bind({});
