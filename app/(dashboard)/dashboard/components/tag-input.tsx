/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { X as RemoveIcon } from 'lucide-react'
import React from 'react'

/**
 * used for identifying the split char and use will pasting
 */
const SPLITTER_REGEX = /[\n#?=&\t,./-]+/

/**
 * used for formatting the pasted element for the correct value format to be added
 */
const FORMATTING_REGEX = /^[^a-zA-Z0-9]*|[^a-zA-Z0-9]*$/g

interface TagsInputProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string[]
  onValueChange: (value: string[]) => void
  placeholder?: string
  maxItems?: number
  minItems?: number
  suggestions?: string[] // NEW: Add suggestions prop
  disabled?: boolean // NEW: Add disabled prop
}

interface TagsInputContextProps {
  value: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onValueChange: (value: any) => void
  inputValue: string
  setInputValue: React.Dispatch<React.SetStateAction<string>>
  activeIndex: number
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>
}

const TagInputContext = React.createContext<TagsInputContextProps | null>(null)

export const TagsInput = React.forwardRef<HTMLDivElement, TagsInputProps>(
  (
    {
      // children,
      value = [],
      onValueChange,
      placeholder,
      maxItems,
      minItems,
      suggestions = [], // NEW: Default empty array
      disabled = false, // NEW: Default false
      className,
      dir,
      ...props
    },
    ref
  ) => {
    const [activeIndex, setActiveIndex] = React.useState(-1)
    const [inputValue, setInputValue] = React.useState('')
    const [disableInput, setDisableInput] = React.useState(false)
    const [disableButton, setDisableButton] = React.useState(false)
    const [isValueSelected, setIsValueSelected] = React.useState(false)
    const [selectedValue, setSelectedValue] = React.useState('')
    const [showSuggestions, setShowSuggestions] = React.useState(false) // NEW: For dropdown
    const [suggestionIndex, setSuggestionIndex] = React.useState(-1) // NEW: For keyboard navigation

    const parseMinItems = minItems ?? 0
    const parseMaxItems = maxItems ?? Infinity

    // NEW: Filter suggestions based on input and exclude already selected values
    const filteredSuggestions = React.useMemo(() => {
      if (!suggestions.length || !inputValue) return []

      return suggestions
        .filter(
          (suggestion) =>
            suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
            !value.includes(suggestion)
        )
        .slice(0, 8) // Limit to 8 suggestions
    }, [suggestions, inputValue, value])

    const onValueChangeHandler = React.useCallback(
      (val: string) => {
        if (!value.includes(val) && value.length < parseMaxItems) {
          onValueChange([...value, val])
        }
      },
      [value, onValueChange, parseMaxItems]
    )

    const RemoveValue = React.useCallback(
      (val: string) => {
        if (value.includes(val) && value.length > parseMinItems) {
          onValueChange(value.filter((item) => item !== val))
        }
      },
      [value, onValueChange, parseMinItems]
    )

    const handlePaste = React.useCallback(
      (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const tags = e.clipboardData.getData('text').split(SPLITTER_REGEX)
        const newValue = [...value]
        tags.forEach((item) => {
          const parsedItem = item.replaceAll(FORMATTING_REGEX, '').trim()
          if (
            parsedItem.length > 0 &&
            !newValue.includes(parsedItem) &&
            newValue.length < parseMaxItems
          ) {
            newValue.push(parsedItem)
          }
        })
        onValueChange(newValue)
        setInputValue('')
        setShowSuggestions(false)
      },
      [value, onValueChange, parseMaxItems]
    )

    const handleSelect = React.useCallback(
      (e: React.SyntheticEvent<HTMLInputElement>) => {
        const target = e.currentTarget
        const selection = target.value.substring(
          target.selectionStart ?? 0,
          target.selectionEnd ?? 0
        )

        setSelectedValue(selection)
        setIsValueSelected(selection === inputValue)
      },
      [inputValue]
    )

    // NEW: Handle suggestion selection
    const selectSuggestion = React.useCallback(
      (suggestion: string) => {
        onValueChangeHandler(suggestion)
        setInputValue('')
        setShowSuggestions(false)
        setSuggestionIndex(-1)
      },
      [onValueChangeHandler]
    )

    React.useEffect(() => {
      const VerifyDisable = () => {
        if (value.length - 1 >= parseMinItems) {
          setDisableButton(false)
        } else {
          setDisableButton(true)
        }
        if (value.length + 1 <= parseMaxItems) {
          setDisableInput(false)
        } else {
          setDisableInput(true)
        }
      }
      VerifyDisable()
    }, [value, parseMinItems, parseMaxItems])

    const handleKeyDown = React.useCallback(
      async (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.stopPropagation()

        // NEW: Handle suggestion navigation
        if (showSuggestions && filteredSuggestions.length > 0) {
          switch (e.key) {
            case 'ArrowDown':
              e.preventDefault()
              setSuggestionIndex((prev) =>
                prev < filteredSuggestions.length - 1 ? prev + 1 : 0
              )
              return
            case 'ArrowUp':
              e.preventDefault()
              setSuggestionIndex((prev) =>
                prev > 0 ? prev - 1 : filteredSuggestions.length - 1
              )
              return
            case 'Enter':
              e.preventDefault()
              if (suggestionIndex >= 0) {
                selectSuggestion(filteredSuggestions[suggestionIndex])
              } else if (inputValue.trim() !== '') {
                onValueChangeHandler(inputValue)
                setInputValue('')
                setShowSuggestions(false)
              }
              return
            case 'Escape':
              setShowSuggestions(false)
              setSuggestionIndex(-1)
              return
          }
        }

        const moveNext = () => {
          const nextIndex =
            activeIndex + 1 > value.length - 1 ? -1 : activeIndex + 1
          setActiveIndex(nextIndex)
        }

        const movePrev = () => {
          const prevIndex =
            activeIndex - 1 < 0 ? value.length - 1 : activeIndex - 1
          setActiveIndex(prevIndex)
        }

        const moveCurrent = () => {
          const newIndex =
            activeIndex - 1 <= 0
              ? value.length - 1 === 0
                ? -1
                : 0
              : activeIndex - 1
          setActiveIndex(newIndex)
        }
        const target = e.currentTarget

        switch (e.key) {
          case 'ArrowLeft':
            if (dir === 'rtl') {
              if (value.length > 0 && activeIndex !== -1) {
                moveNext()
              }
            } else {
              if (value.length > 0 && target.selectionStart === 0) {
                movePrev()
              }
            }
            break

          case 'ArrowRight':
            if (dir === 'rtl') {
              if (value.length > 0 && target.selectionStart === 0) {
                movePrev()
              }
            } else {
              if (value.length > 0 && activeIndex !== -1) {
                moveNext()
              }
            }
            break

          case 'Backspace':
          case 'Delete':
            if (value.length > 0) {
              if (activeIndex !== -1 && activeIndex < value.length) {
                RemoveValue(value[activeIndex])
                moveCurrent()
              } else {
                if (target.selectionStart === 0) {
                  if (selectedValue === inputValue || isValueSelected) {
                    RemoveValue(value[value.length - 1])
                  }
                }
              }
            }
            break

          case 'Escape':
            const newIndex = activeIndex === -1 ? value.length - 1 : -1
            setActiveIndex(newIndex)
            setShowSuggestions(false)
            break

          case 'Enter':
            if (inputValue.trim() !== '') {
              e.preventDefault()
              onValueChangeHandler(inputValue)
              setInputValue('')
              setShowSuggestions(false)
            }
            break
        }
      },
      [
        activeIndex,
        value,
        inputValue,
        RemoveValue,
        showSuggestions,
        filteredSuggestions,
        suggestionIndex,
        selectSuggestion,
        onValueChangeHandler,
        dir,
      ]
    )

    const mousePreventDefault = React.useCallback((e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
    }, [])

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.currentTarget.value
        setInputValue(newValue)

        // NEW: Show suggestions when typing
        if (newValue && suggestions.length > 0) {
          setShowSuggestions(true)
          setSuggestionIndex(-1)
        } else {
          setShowSuggestions(false)
        }
      },
      [suggestions.length]
    )

    // NEW: Close suggestions when clicking outside
    React.useEffect(() => {
      const handleClickOutside = () => {
        setShowSuggestions(false)
        setSuggestionIndex(-1)
      }

      if (showSuggestions) {
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
      }
    }, [showSuggestions])

    return (
      <TagInputContext.Provider
        value={{
          value,
          onValueChange,
          inputValue,
          setInputValue,
          activeIndex,
          setActiveIndex,
        }}
      >
        <div className="relative">
          <div
            {...props}
            ref={ref}
            dir={dir}
            className={cn(
              'flex items-center flex-wrap gap-1 p-1 rounded-lg bg-background overflow-hidden ring-1 ring-muted',
              {
                'focus-within:ring-ring': activeIndex === -1,
                'opacity-50 cursor-not-allowed': disabled,
              },
              className
            )}
          >
            {value?.map((item, index) => (
              <Badge
                tabIndex={activeIndex !== -1 ? 0 : activeIndex}
                key={item}
                aria-disabled={disableButton || disabled}
                data-active={activeIndex === index}
                className={cn(
                  "relative px-1 rounded flex items-center gap-1 data-[active='true']:ring-2 data-[active='true']:ring-muted-foreground truncate aria-disabled:opacity-50 aria-disabled:cursor-not-allowed"
                )}
                variant={'secondary'}
              >
                <span className="text-xs">{item}</span>
                <button
                  type="button"
                  aria-label={`Remove ${item} option`}
                  aria-roledescription="button to remove option"
                  disabled={disableButton || disabled}
                  onMouseDown={mousePreventDefault}
                  onClick={() => RemoveValue(item)}
                  className="disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Remove {item} option</span>
                  <RemoveIcon className="h-4 w-4 hover:stroke-destructive" />
                </button>
              </Badge>
            ))}
            <Input
              tabIndex={0}
              aria-label="input tag"
              disabled={disableInput || disabled}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              value={inputValue}
              onSelect={handleSelect}
              onChange={activeIndex === -1 ? handleChange : undefined}
              placeholder={placeholder}
              onClick={() => {
                setActiveIndex(-1)
                // NEW: Show suggestions on focus if there are any and input has value
                if (inputValue && suggestions.length > 0) {
                  setShowSuggestions(true)
                }
              }}
              className={cn(
                'outline-0 border-none h-7 min-w-fit flex-1 focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 placeholder:text-muted-foreground px-1',
                activeIndex !== -1 && 'caret-transparent'
              )}
            />
          </div>

          {/* NEW: Suggestions Dropdown */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-60 overflow-y-auto">
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={suggestion}
                  type="button"
                  className={cn(
                    'w-full text-right px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors',
                    index === suggestionIndex &&
                      'bg-accent text-accent-foreground'
                  )}
                  onClick={() => selectSuggestion(suggestion)}
                  onMouseEnter={() => setSuggestionIndex(index)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </TagInputContext.Provider>
    )
  }
)

TagsInput.displayName = 'TagsInput'
