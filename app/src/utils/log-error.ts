export const logError = (place: string, error: unknown) => {
  console.error(
    `CustomError:
    [place: ${place}]
    [time: ${new Date().toLocaleString()}]
    ${error}`
  );
};
