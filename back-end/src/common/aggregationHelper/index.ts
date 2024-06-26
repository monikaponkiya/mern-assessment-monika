export async function tableLookup(
  aggregateQuery,
  tableName: string,
  localField: string,
  foreignField: string,
  topicName: string,
  isUnwind: boolean,
) {
  aggregateQuery.push({
    $lookup: {
      from: tableName,
      localField: localField,
      foreignField: foreignField,
      as: topicName,
    },
  });

  if (isUnwind) {
    aggregateQuery.push({
      $unwind: {
        path: `$${topicName}`,
        preserveNullAndEmptyArrays: true,
      },
    });
  }
}
