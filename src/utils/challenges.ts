import { TeamChallenge } from '../types/game';

export const TEAM_CHALLENGES: TeamChallenge[] = [
  {
    id: 1,
    title: 'Kể tên 3 vị trí trong bóng chuyền',
    instruction: 'Người đang giữ bóng hoặc cả nhóm nhanh chóng kể tên 3 vị trí trên sân.',
    duration: 20,
    hint: 'Gợi ý: Chuyền hai (Setter), Chủ công (Outside Hitter), Phụ công (Middle Blocker), Đối chuyền (Opposite), Libero.'
  },
  {
    id: 2,
    title: 'Cả nhóm đồng thanh hô khẩu hiệu của CLB',
    instruction: 'Tất cả 20 thành viên cùng đứng dậy và hô to khẩu hiệu để tiếp thêm năng lượng!',
    duration: 15,
    hint: 'Khẩu hiệu: "Một đường chuyền – Một người bạn – Một tập thể!" hoặc "Lửa Trẻ FPT Hậu Giang!"'
  },
  {
    id: 3,
    title: 'Kể tên 3 kỹ thuật bóng chuyền',
    instruction: 'Nêu tên 3 kỹ thuật cơ bản được sử dụng trong một trận thi đấu bóng chuyền.',
    duration: 20,
    hint: 'Gợi ý: Phát bóng (Serve), Chuyền bóng búng tay (Set), Đệm bóng (Dig/Pass), Đập bóng (Spike), Bắn bóng/Chắn bóng (Block).'
  },
  {
    id: 4,
    title: 'Cả nhóm thực hiện động tác chuyền bóng mô phỏng trong 5 giây',
    instruction: 'Tất cả thành viên cùng làm động tác chuẩn bị tư thế đệm bóng (bắt bước một) hoặc giơ tay búng bóng.',
    duration: 20,
    hint: 'Thực hiện tư thế thể thao khỏe khoắn và cùng đếm ngược 5 giây!'
  },
  {
    id: 5,
    title: 'Kể tên 3 điều một đồng đội tốt nên làm',
    instruction: 'Nêu 3 hành động thể hiện tinh thần đồng đội và hỗ trợ nhau trên sân cũng như ngoài đời.',
    duration: 20,
    hint: 'Gợi ý: Động viên khi đồng đội hỏng bóng, Nhắc vị trí và bọc lót, Lắng nghe và tôn trọng chiến thuật tập thể.'
  },
  {
    id: 6,
    title: 'Cả nhóm chọn một từ thể hiện tinh thần Lửa Trẻ',
    instruction: 'Đồng thanh hoặc đại diện nói một từ khóa mang ngọn lửa nhiệt huyết của CLB hôm nay.',
    duration: 15,
    hint: 'Gợi ý: Nhiệt huyết, Bền bỉ, Đoàn kết, Đam mê, Tự tin, Bứt phá.'
  },
  {
    id: 7,
    title: 'Kể tên 3 quy tắc an toàn khi tập luyện bóng chuyền',
    instruction: 'Nhắc lại 3 lưu ý quan trọng để tránh chấn thương khi thi đấu và tập luyện.',
    duration: 25,
    hint: 'Gợi ý: Khởi động khớp cổ tay/cổ chân kỹ, Không dẫm qua vạch giữa sân khi chắn bóng, Mang giày thể thao có độ bám sàn tốt.'
  },
  {
    id: 8,
    title: 'Cả nhóm tạo dáng ăn mừng chiến thắng trong 5 giây',
    instruction: 'Tất cả cùng tạo dáng ăn mừng một pha bóng ghi điểm tuyệt đẹp và cùng reo hò!',
    duration: 20,
    hint: 'Tạo dáng thật năng lượng, đập tay đồng đội hoặc giơ nắm đấm chiến thắng!'
  }
];

export function getRandomChallenge(excludedIds: number[] = []): TeamChallenge {
  const available = TEAM_CHALLENGES.filter(c => !excludedIds.includes(c.id));
  if (available.length === 0) {
    // If all challenges used, pick any
    const randomIndex = Math.floor(Math.random() * TEAM_CHALLENGES.length);
    return TEAM_CHALLENGES[randomIndex];
  }
  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
}
