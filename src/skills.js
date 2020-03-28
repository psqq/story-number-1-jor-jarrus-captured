
const skills = [
  {
    id: 'passive-mc-skill',
    name: 'Восстановление',
    desc: 'Восстанавливает 10% от максимального здоровья за убийство',
    trigger: 'kill-enemy',
    effect: 'health-10-percent-of-max-hp',
  },
  {
    id: 'q-mc-skill',
    name: 'Восстановление',
    desc: 'Восстанавливает 10% от максимального здоровья за убийство',
    trigger: 'kill-enemy',
    effect: 'health-10-percent-of-max-hp',
  },
];

function findSkillById(id) {
  return skills.find(x => x.id == id);
}

export {
  skills,
  findSkillById,
};
