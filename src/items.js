export default [
  {
    id: 'item-knife',
    name: 'Нож',
    desc: 'Незначительно увеличивает урон',
    cost: 130,
    passives: {
      name: 'flat-bonus-ad',
      value: 10,
    },
  },
  {
    id: 'item-sword',
    name: 'Меч',
    desc: 'Увеличивает урон',
    cost: 290,
    required: ['item-knife', 'item-knife'],
    passives: {
      name: 'flat-bonus-ad',
      value: 40,
    },
  },
]
