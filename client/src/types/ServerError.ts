export class ServerError {
  public constructor(
    public code: string,
    public message: string,
    public status?: number,
  ) {}
}
