export interface IUserRoomRepository {
  existsBan(ip: string): Promise<boolean>;
  banUser(ip: string): Promise<boolean>;
}
