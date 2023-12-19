import { CollectionConfig } from 'payload/types'

const Channels: CollectionConfig = {
  slug: 'channels',
  admin: {
    useAsTitle: 'email',
  },
  access:{
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true
  },
  fields: [
    {
      name: 'channel',
      type: 'text'
    },
    {
        name: 'chatlog',
        type: 'array',
        fields: [
          {
              name: 'sender',
              type: 'text'
          },
          {
              name: 'message',
              type: 'textarea'
          }
      ]
    },
  ],
}

export default Channels
