import { Schema, model, models } from "mongoose";

const OperationalAssessmentSchema = new Schema({
  annexE: {
    type: Schema.Types.ObjectId,
    ref: "AnnexE",
  },
  v01: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  v02: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  v03: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  v04: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  v05: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  v06: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  v07: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  v08: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  v09: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  s1: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  s2: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  s3: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  e1: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  e2: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  e3: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  a1: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  a2: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  a3: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  l1: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  l2: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  l3: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  sdg1: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  sdg2: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  sdg3: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  sdg4: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  sdg5: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  sdg6: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  sdg7: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  sdg8: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  sdg9: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  sdg10: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  sdg11: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  sdg12: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  sdg13: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  sdg14: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  sdg15: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  sdg16: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  sdg17: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
});

const OperationalAssessment =
  models.OperationalAssessment || model("OperationalAssessment", OperationalAssessmentSchema);

export default OperationalAssessment;

//   {
//     id: "V01",
//     title: "Thomasian Identity",
//     description:
//       "To form servant leaders who espouse Thomasian ideals and values as they collaborate with the University in the fulfillment of her mission and actively take part in nation building.",
//   },
//   {
//     id: "V02",
//     title: "Leadership and Governance",
//     description:
//       "To fully actualize a proactive, systematic, and mission-oriented University leadership and governance in order to be recognized as a premiere institution of Learning in Asia.",
//   },
//   {
//     id: "V03",
//     title: "Teaching and Learning",
//     description: "To be a world-class institution of higher learning.",
//   },
//   {
//     id: "V04",
//     title: "Research and Innovation",
//     description:
//       "To become an internationally acknowledged expert in pioneering and innovative research in the arts and humanities, social science, business management and education, health and allied sciences, science and technology, and the sacred sciences.",
//   },
//   {
//     id: "V05",
//     title: "Community Development and Advocacy",
//     description:
//       "To become a vibrant community of evangelizers actively engaged in social transformation through advocacy and ministry.",
//   },
//   {
//     id: "V06",
//     title: "Student Welfare and Services",
//     description:
//       "To promote and ensure student academic achievement and life success through responsive and empirical-based services of global standards.",
//   },
//   {
//     id: "V07",
//     title: "Public Presence",
//     description:
//       "To be an institution of preeminent influence in the global community by taking a proactive stance in social, cultural, and moral advocacies and assuming a lead role in national and international policy formulation.",
//   },
//   {
//     id: "V08",
//     title: "Resource Management",
//     description:
//       "To provide a conducive learning and working environment with state-of-the-art facilities and resources in a self-sustainable University through the engagement of a professional Thomasian workforce who meets international standards and adapts to global change.",
//   },
//   {
//     id: "V09",
//     title: "Internationalization",
//     description:
//       "To promote internationalization and integrate it into the institution's strategic plans and initiatives for the purpose of preparing students for a productive engagement in the global arena of ideas and work.",
//   },
// ];

// const sealIndicators: { category: string; indicators: string[] }[] = [
//   {
//     category: "Servant Leader",
//     indicators: [
//       "S1: Show leadership abilities to promote advocacies for life, freedom, justice, and solidarity in the service of the family, the local and global communities, the Church and the environment.",
//       "S2: Implement relevant projects and activities that speak of Christian compassion to the poor and the marginalized in order to raise their quality of life.",
//       "S3: Show respect for the human person, regardless of race, religion, age, and gender.",
//     ],
//   },
//   {
//     category: "Effective communicator and collaborator",
//     indicators: [
//       "E1: Express myself clearly, correctly, and confidently in various environments, contexts, and technologies of human interaction.",
//       "E2: Work productively with individuals or groups from diverse cultures and demographics.",
//       "E3: Show profound respect for individual differences and/or uniqueness as members of God's creation.",
//     ],
//   },
//   {
//     category: "Analytical and creative thinker",
//     indicators: [
//       "A1: Show judiciousness and resourcefulness in making personal and professional decisions.",
//       "A2: Engage in research undertakings that respond to societal issues.",
//       "A3: Express personal and professional insights through an ethical and evidence-based approach.",
//     ],
//   },
//   {
//     category: "Lifelong learner",
//     indicators: [
//       "L1: Engage in reflective practice to ensure disciplinal relevance and professional development.",
//       "L2: Exhibit preparedness and interest for continuous upgrading of competencies required by the profession or area of specialization.",
//       "L3: Manifest fidelity to the teachings of Christ, mediated by the Catholic Church, in the continuous deepening of faith and spirituality in dealing with new life situations and challenges.",
//     ],
//   },
// ];

// const projectDirections: string[] = [
//   "SDG 1 END POVERTY",
//   "SDG 2 END HUNGER",
//   "SDG 3 WELL-BEING",
//   "SDG 4 QUALITY EDUCATION",
//   "SDG 5 GENDER EQUALITY",
//   "SDG 6 WATER AND SANITATION FOR ALL",
//   "SDG 7 AFFORDABLE AND SUSTAINABLE ENERGY",
//   "SDG 8 DECENT WORK FOR ALL",
//   "SDG 9 TECHNOLOGY TO BENEFIT ALL",
//   "SDG 10 REDUCE INEQUALITY",
//   "SDG 11 SAFE CITIES AND COMMUNITIES",
//   "SDG 12 RESPONSIBLE CONSUMPTION BY ALL",
//   "SDG 13 STOP CLIMATE CHANGE",
//   "SDG 14 PROTECT THE OCEAN",
//   "SDG 15 TAKE CARE OF THE EARTH",
//   "SDG 16 LIVE IN PEACE",
//   "SDG 17 MECHANISMS AND PARTNERSHIPS TO REACH THE GOAL",
// ];

// const allCategories: Category[] = [
//   ...strategicAreas,
//   ...sealIndicators.flatMap((category, index) =>
//     category.indicators.map((indicator, i) => ({
//       id: `SEAL-${index}-${i}`,
//       title: `${category.category} - ${indicator.split(":")[0]}`,
//       description: indicator.split(":")[1].trim(),
//     }))
//   ),
//   ...projectDirections.map((direction, index) => ({
//     id: `PD-${index}`,
//     title: direction,
//   })),
// ];
