import { Entity } from 'src/core/entities/entity'
import { Optional } from 'src/core/types/optional'

import { UniqueEntityID } from '@/core/entities/unique.entity-id'

export interface AdminProps {
  name: string
  email: string
  password: string
  inactivatedAt?: Date | null
  createdAt: Date
  updatedAt?: Date | null
  passwordResetToken?: string
  passwordResetTokenExpiresAt?: Date | null
}

export class Admin extends Entity<AdminProps> {
  get name(): string {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get email(): string {
    return this.props.email
  }

  set email(email: string) {
    this.props.email = email
    this.touch()
  }

  get password(): string {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
    this.touch()
  }

  get inactivatedAt(): Date | null {
    return this.props.inactivatedAt
  }

  set inactivatedAt(inactivatedAt: Date | null) {
    this.props.inactivatedAt = inactivatedAt
    this.touch()
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date | null {
    return this.props.updatedAt
  }

  get passwordResetToken(): string | null {
    return this.props.passwordResetToken
  }

  set passwordResetToken(passwordResetToken: string | null) {
    this.props.passwordResetToken = passwordResetToken
    this.touch()
  }

  get passwordResetTokenExpiresAt(): Date | null {
    return this.props.passwordResetTokenExpiresAt
  }

  set passwordResetTokenExpiresAt(passwordResetTokenExpiresAt: Date | null) {
    this.props.passwordResetTokenExpiresAt = passwordResetTokenExpiresAt
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(props: Optional<AdminProps, 'createdAt'>, id?: UniqueEntityID) {
    const admin = new Admin(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return admin
  }
}
