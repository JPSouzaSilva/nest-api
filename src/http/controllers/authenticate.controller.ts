import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { compare } from 'bcryptjs'

const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type LoginBodySchema = z.infer<typeof loginBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(loginBodySchema))
  async handle(@Body() body: LoginBodySchema) {
    const { email, password } = body

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const passwordCompare = await compare(password, user.password)

    if (!passwordCompare) {
      throw new BadRequestException('Credentials not match')
    }

    const token = this.jwt.sign({ sub: user.id })

    return {
      accessToken: token,
    }
  }
}
