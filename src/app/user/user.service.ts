import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { UpdateProfileInput } from './dto/updateProfile.input';
import { Profile } from '../entities/profile.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Profile) private readonly profileRepo: Repository<Profile>
  ) {}

  async findAll(first: number, cursor: number): Promise<Profile[]> {
    return await this.profileRepo.find({
      take: first,
      skip: cursor,
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Profile> {
    return await this.profileRepo.findOneByOrFail({ id });
  }

  async updateProfile(id: number, updateProfileInput: UpdateProfileInput): Promise<Profile> {
    const user = await this.userRepo.findOne({
      where: { id },
    });

    if (!user) throw new Error('User not found');

    if (user.profile_id) {
      const profileId = await user.profile_id;
      const profile = await this.profileRepo.findOne({
        where: { id: profileId },
      });

      Object.assign(profile, updateProfileInput);
      await this.profileRepo.save(profile);
      return profile;
    } else {
      const profile = this.profileRepo.create({
        ...updateProfileInput,
        author: user.id,
      });
      await this.profileRepo.save(profile);
      user.profile_id = profile.id;
      await this.userRepo.save(user);
      return profile;
    }

  }

  async getProfile(id: number): Promise<Profile> {
    return await this.profileRepo.findOne({ where: { author: id } });
  }

  async getTags() {
    const profiles = await this.profileRepo.find({
      select: ['tags'],
    });

    const tags = profiles.flatMap((p) => p.tags);
    return Array.from(new Set(tags));
  }

  async remove(id: number) {
    const result = await this.userRepo.delete(id);
    return result.affected === 1;
  }
}
