/**
 * Chuyển tiêu đề tiếng Việt thành slug URL an toàn.
 * "Nam Định vô địch V.League!" -> "nam-dinh-vo-dich-v-league"
 */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // bỏ dấu tiếng Việt
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // mọi ký tự lạ thành gạch nối
    .replace(/^-+|-+$/g, '') // cắt gạch nối thừa ở hai đầu
    .slice(0, 120)
}
