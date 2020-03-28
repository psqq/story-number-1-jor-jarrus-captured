
const skills = [
  {
    id: 'passive-mc-skill',
    name: 'Восстановление',
    desc: 'Восстанавливает 10% от максимального здоровья за убийство',
    passive: true,
    active: true,
    duration: Infinity,
    trigger: 'kill-enemy',
    effect: {
      id: 'health-on-percent-of-max-hp',
      value: 0.2,
    },
  },
  {
    id: 'q-mc-skill',
    name: 'Уворот',
    desc: 'На 3 4 5 6 7 хода шанс уклонения будет 50%',
    passive: false,
    active: false,
    duration: 0,
    trigger: 'attack-defense',
    effect: {
      id: 'chance-to-dodge',
      value: 0.5,
    },
  },
];

function findSkillById(id, arrOfSkills) {
  arrOfSkills = arrOfSkills || skills;
  return arrOfSkills.find(x => x.id == id);
}

export {
  skills,
  findSkillById,
};
