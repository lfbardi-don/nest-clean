export class Slug {
  public value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Slug {
    return new Slug(value);
  }

  /**
   * Receives a string and returns a Slug
   * @param value string
   * @returns Slug
   *
   * @example
   * ```
   * Hello World => hello-world
   *
   * ```
   */
  static fromString(value: string): Slug {
    const slug = value
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\s-]/g, '')
      .replace(/_/g, '-')
      .replace(/--/g, '-')
      .replace(/-$/g, '');

    return Slug.create(slug);
  }
}
