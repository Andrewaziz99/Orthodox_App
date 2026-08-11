export function parseFeaturedIds(serializedIds?: string): string[] {
  if (!serializedIds) return [];

  try {
    const parsedIds: unknown = JSON.parse(serializedIds);
    return Array.isArray(parsedIds) && parsedIds.every((id) => typeof id === 'string')
      ? parsedIds
      : [];
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    return [];
  }
}
