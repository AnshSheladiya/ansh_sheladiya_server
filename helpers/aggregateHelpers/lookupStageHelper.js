exports.createLookupStage = (from, localField, foreignField, as) => {
  return { $lookup: { from, localField, foreignField, as } };
};

exports.createLookupAndProjectStage = (from, localField, foreignField, as, fields) => {
  const projectFields = {};

  // Create the projection fields object
  fields.forEach((field) => {
    projectFields[field] = 1;
  });

  return {
    $lookup: {
      from,
      localField,
      foreignField,
      as,
      pipeline: [
        {
          $project: projectFields,
        },
      ],
    },
  };
};
