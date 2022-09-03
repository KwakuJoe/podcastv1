import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Category from 'App/Models/Category';


export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await Category.createMany([
      {
        name: 'Development',
        slug: 'development category',
        description: 'Everything about Software development',
      },
      {
        name: 'Relationship',
        slug: 'relationship category',
        description: 'Everything about love and relationship',
      },
      {
        name: 'Sports',
        slug: 'sports category',
        description: 'Everything about sport all round',
      },
    ]);

  }
}

