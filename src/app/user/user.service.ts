import { Injectable } from "@nestjs/common";
import { ArrayContains, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/users.entity";
import { UpdateProfileInput } from "./dto/updateProfile.input";
import { Profile } from "../entities/profile.entity";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
    private readonly jwtService: JwtService
  ) {}

  async findAll(
    first: number,
    cursor: number,
    tags: string[]
  ): Promise<Profile[]> {
    const users = await this.profileRepo.find({
      where: {
        tags: ArrayContains(tags),
      },
      take: first,
      skip: cursor,
      order: { id: "ASC" },
    });
    return users;
  }

  async findOne(id: number): Promise<Profile> {
    return await this.profileRepo.findOneByOrFail({ id });
  }

  async updateProfile(
    token: string,
    updateProfileInput: UpdateProfileInput
  ): Promise<string> {
    if (!token) throw new Error("Token not found");

    const decoded = this.jwtService.verify(token);
    const id = decoded.id;

    const user = await this.userRepo.findOne({
      where: { id },
      relations: ["profile"],
    });

    if (!user) throw new Error("User not found");
    if (!user.profile) throw new Error("Profile not found");

    await this.profileRepo.update(user.profile.id, updateProfileInput);

    return "Success";
  }

  async getProfile(token: string): Promise<Profile> {
    try {
      if (!token) {
        throw new Error("Token not found");
      }
      const cleanToken = token
        ?.split(" ")[1];
      const decoded = this.jwtService.verify(cleanToken);
      const id = decoded.id;

      const user = await this.userRepo.findOne({
        where: { id },
        relations: ["profile"],
      });

      if (!user) throw new Error("User not found");

      if (!user.profile) throw new Error("Profile not found");

      return user.profile;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getTags() {
    const profiles = await this.profileRepo.find({
      select: { tags: true },
    });

    const tags = profiles.flatMap((p) => p.tags);
    return Array.from(new Set(tags));
  }

  async remove(id: number) {
    const result = await this.userRepo.delete(id);
    return result.affected === 1;
  }
}
