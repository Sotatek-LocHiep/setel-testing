import {
  Button,
  ButtonGroup,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
} from '@chakra-ui/react'
import React from 'react'

interface CancelButtonProps {
  isBtnLoading: boolean
  isBtnDisabled: boolean
  textButton: string
  iconButton: any
  colorScheme: string
  textHeaderPopover: string
  textBodyPopover: string
  onConfirm: () => void | Promise<void>
}

export default function ConfirmButton({
  isBtnLoading,
  isBtnDisabled,
  textButton,
  iconButton,
  colorScheme,
  textHeaderPopover,
  textBodyPopover,
  onConfirm,
}: CancelButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const open = () => setIsOpen(!isOpen)
  const close = () => setIsOpen(false)
  return (
    <Popover
      returnFocusOnClose={false}
      isOpen={isOpen}
      onClose={close}
      placement="right"
      closeOnBlur={true}
    >
      <PopoverTrigger>
        <Button
          onClick={open}
          colorScheme={colorScheme}
          variant="outline"
          size="sm"
          rightIcon={iconButton}
          isLoading={isBtnLoading}
          isDisabled={isBtnDisabled}
        >
          {textButton}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader fontWeight="semibold">{textHeaderPopover}</PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>{textBodyPopover}</PopoverBody>
        <PopoverFooter d="flex" justifyContent="flex-end">
          <ButtonGroup size="sm">
            <Button variant="outline" onClick={close}>
              No
            </Button>
            <Button
              colorScheme={colorScheme}
              onClick={() => onConfirm() && close()}
            >
              Yes
            </Button>
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  )
}
