import { i18n } from 'i18next';

import { MeetupCardVariant, MeetupTabContent, MeetupTabLink } from 'components';

export interface MeetupTabDescriptor {
  label: (i18nInstance: i18n) => string;
  component: React.ReactNode | JSX.Element;
}

export const meetupTabsMapper: Record<MeetupTabLink, MeetupTabDescriptor> = {
  [MeetupTabLink.Topics]: {
    label: ({ t }: i18n) =>
      t('meetupTabs.tabTitle', { context: MeetupTabLink.Topics }),
    component: <MeetupTabContent variant={MeetupCardVariant.Topic} />,
  },
  [MeetupTabLink.Drafts]: {
    label: ({ t }: i18n) =>
      t('meetupTabs.tabTitle', { context: MeetupTabLink.Drafts }),
    component: <MeetupTabContent variant={MeetupCardVariant.Draft} />,
  },
  [MeetupTabLink.Upcoming]: {
    label: ({ t }: i18n) =>
      t('meetupTabs.tabTitle', { context: MeetupTabLink.Upcoming }),
    component: <MeetupTabContent variant={MeetupCardVariant.Upcoming} />,
  },
  [MeetupTabLink.Finished]: {
    label: ({ t }: i18n) =>
      t('meetupTabs.tabTitle', { context: MeetupTabLink.Finished }),
    component: <MeetupTabContent variant={MeetupCardVariant.Finished} />,
  },
};
