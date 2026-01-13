import { defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Prodotto',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nome',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Descrizione',
      type: 'text',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'price',
      title: 'Prezzo',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    },
    {
      name: 'image',
      title: 'Immagine',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Categoria',
      type: 'string',
      options: {
        list: [
          { title: 'Bracciale', value: 'bracciale' },
          { title: 'Collana', value: 'collana' },
          { title: 'Orecchini', value: 'orecchini' },
          { title: 'Anello', value: 'anello' }
        ]
      }
    }
  ]
  
})
