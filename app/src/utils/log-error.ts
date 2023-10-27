export const logError = (place: string, error: unknown) => {
  console.error(`Error at ${place}:\n`, JSON.stringify(error, null, 2));
};
