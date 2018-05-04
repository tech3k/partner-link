export class PartnerLinkError extends Error {
  public code: number;
  public reference: string | null;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
    this.name = 'PartnerLinkError';
    Object.setPrototypeOf(this, new.target.prototype);
  }

  public setReference(reference: string): void {
    this.reference = reference;
  }

  public getReference(): string | null {
    return this.reference;
  }
}
