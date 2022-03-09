const ai =  require('./spells-ai.json');
const aitfravt =  require('./spells-aitfr-avt.json');
const egw =  require('./spells-egw.json');
const ftd =  require('./spells-ftd.json');
const ggr =  require('./spells-ggr.json');
const idrotf =  require('./spells-idrotf.json');
const llk =  require('./spells-llk.json');
const phb =  require('./spells-phb.json');
const scc =  require('./spells-scc.json');
const tce =  require('./spells-tce.json');
const xge =  require('./spells-xge.json');

export const SPELLS = [
    ...ai.spell,
    ...aitfravt.spell,
    ...egw.spell,
    ...ftd.spell,
    ...ggr.spell,
    ...idrotf.spell,
    ...llk.spell,
    ...phb.spell,
    ...scc.spell,
    ...tce.spell,
    ...xge.spell,
];