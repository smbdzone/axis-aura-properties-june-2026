import { contentPageDefaults } from '../data/contentPageDefaults';
import { ContentPage } from '../models/contentPage.model';

export async function seedContentPages() {
  let created = 0;

  for (const defaults of contentPageDefaults) {
    const exists = await ContentPage.findOne({ slug: defaults.slug });
    if (exists) continue;

    await ContentPage.create(defaults);
    created += 1;
    console.log(`Seeded content page: ${defaults.slug}`);
  }

  if (created === 0) {
    console.log('Content pages already seeded.');
  } else {
    console.log(`Content page seed complete. Created: ${created}`);
  }
}
