// Layout: tab_cpt_section
// Each tab selects a post_type (casestudy | insight | team) and shows 3 cards.
// Data is fetched server-side; tab switching is client-side via TabsCptClient.

import { getCaseStudies, getAllPosts, getTeamMembers } from '@/lib/api';
import TabsCptClient from './TabsCptClient';

export default async function TabsCptSection({ data }) {
  const {
    background_color,
    sub_heading,
    heading,
    description,
    custom_class,
    custom_id,
    tab_style,
    tab: rawTabs,
  } = data || {};

  const tabs = Array.isArray(rawTabs) ? rawTabs : [];
  if (!tabs.length) return null;

  const style = (tab_style || 'top').trim().toLowerCase();

  // Fetch only the post types actually used across the tabs
  const neededTypes = [...new Set(tabs.map((t) => t.post_type).filter(Boolean))];

  const [caseStudies, posts, teamMembers] = await Promise.all([
    neededTypes.includes('casestudy') ? getCaseStudies() : [],
    neededTypes.includes('insight')   ? getAllPosts()    : [],
    neededTypes.includes('team')      ? getTeamMembers() : [],
  ]);

  const tabData = {
    casestudy: caseStudies,
    insight:   posts,
    team:      teamMembers,
  };

  return (
    <TabsCptClient
      tabs={tabs}
      tabData={tabData}
      style={style}
      background_color={background_color}
      sub_heading={sub_heading}
      heading={heading}
      description={description}
      custom_class={custom_class}
      custom_id={custom_id}
    />
  );
}
