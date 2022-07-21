import { fireEvent, screen } from '@testing-library/react'
import { faker } from '@faker-js/faker'

export const expectChildCount = (fieldName: string, count: number): void => {
  const el = screen.getByTestId(fieldName)
  expect(el.childElementCount).toBe(count)
}

export const expectButtonIsDisabled = (fieldName: string, isDisabled: boolean): void => {
  const button: HTMLButtonElement = screen.getByTestId(fieldName)
  expect(button.disabled).toBe(isDisabled)
}

export const expectStatusForField = (fieldName: string, validationError?: string): void => {
  const status = screen.getByTestId(`${fieldName}-status`)
  expect(status.title).toBe(validationError || 'Tudo certo!')
  expect(status.textContent).toBe(validationError ? '🔴' : '🟢')
}

export const populateField = (fieldName: string, value = faker.random.word()): void => {
  const input = screen.getByTestId(fieldName)
  fireEvent.input(input, { target: { value: value } })
}

export const testElementExists = (fieldName: string): void => {
  const el = screen.getByTestId(fieldName)
  expect(el).toBeTruthy()
}

export const testElementText = (fieldName: string, text: string): void => {
  const el = screen.getByTestId(fieldName)
  expect(el.textContent).toBe(text)
}
