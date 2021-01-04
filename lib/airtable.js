import Airtable from 'airtable'

const base = new Airtable({ apiKey: 'keymPtqCv1ps60g2Y'}).base('appa7qanJ0pXHwvJV');

const table = base('Catalogue');

export async function getRecords() {
  const records = await table.select()
  const results = await records.all()
  const selectedFields = results.map(item => {
    let fields = item.fields
    return {
      id: item.id,
      animal: fields["Nom du Produit"],
      image: {
        filename: fields["Image"][0].filename,
        url: fields["Image"][0].url
      }
    }
  })
  return {
    selectedFields,
  }
}