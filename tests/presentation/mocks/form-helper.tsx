import { fireEvent, screen } from '@testing-library/react'
import { faker } from '@faker-js/faker'

export const expectStatusForField = (fieldName: string, validationError?: string): void => {
  const status = screen.getByTestId(`${fieldName}-status`)
  expect(status.title).toBe(validationError || 'Tudo certo!')
  expect(status.textContent).toBe(validationError ? '🔴' : '🟢')
}

export const populateField = (fieldName: string, value = faker.random.word()): void => {
  const input = screen.getByTestId(fieldName)
  fireEvent.input(input, { target: { value: value } })
}
