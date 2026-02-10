<?php

namespace App\Helpers;

/**
 * Helper class for generating secure passwords and other utilities.
 */
class PasswordGenerator
{
    /**
     * Character sets for password generation.
     */
    private const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
    private const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    private const NUMBERS = '0123456789';
    private const SPECIAL = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    /**
     * Generate a secure random password.
     *
     * @param int $length The length of the password (default: 12)
     * @param bool $includeLowercase Include lowercase letters (default: true)
     * @param bool $includeUppercase Include uppercase letters (default: true)
     * @param bool $includeNumbers Include numbers (default: true)
     * @param bool $includeSpecial Include special characters (default: true)
     * @return string The generated secure password
     */
    public static function generate(
        int $length = 12,
        bool $includeLowercase = true,
        bool $includeUppercase = true,
        bool $includeNumbers = true,
        bool $includeSpecial = true
    ): string {
        if ($length < 4) {
            $length = 4;
        }

        $password = '';
        $charset = '';

        // Ensure at least one character from each requested set
        if ($includeUppercase) {
            $password .= self::UPPERCASE[random_int(0, strlen(self::UPPERCASE) - 1)];
            $charset .= self::UPPERCASE;
        }

        if ($includeLowercase) {
            $password .= self::LOWERCASE[random_int(0, strlen(self::LOWERCASE) - 1)];
            $charset .= self::LOWERCASE;
        }

        if ($includeNumbers) {
            $password .= self::NUMBERS[random_int(0, strlen(self::NUMBERS) - 1)];
            $charset .= self::NUMBERS;
        }

        if ($includeSpecial) {
            $password .= self::SPECIAL[random_int(0, strlen(self::SPECIAL) - 1)];
            $charset .= self::SPECIAL;
        }

        // Fill the rest of the password length
        $remainingLength = $length - strlen($password);
        
        if ($remainingLength > 0 && $charset !== '') {
            $password .= self::randomString($remainingLength, $charset);
        }

        // Shuffle the password to randomize character order
        return self::shuffle($password);
    }

    /**
     * Generate a random string from a given charset.
     *
     * @param int $length The length of the string to generate
     * @param string $charset The characters to use
     * @return string The generated random string
     */
    private static function randomString(int $length, string $charset): string
    {
        $result = '';
        $charsetLength = strlen($charset);

        for ($i = 0; $i < $length; $i++) {
            $result .= $charset[random_int(0, $charsetLength - 1)];
        }

        return $result;
    }

    /**
     * Shuffle a string using a cryptographically secure method.
     *
     * @param string $string The string to shuffle
     * @return string The shuffled string
     */
    private static function shuffle(string $string): string
    {
        $array = str_split($string);
        shuffle($array);
        
        // Re-shuffle using Fisher-Yates for better randomness
        $count = count($array);
        for ($i = $count - 1; $i > 0; $i--) {
            $j = random_int(0, $i);
            [$array[$i], $array[$j]] = [$array[$j], $array[$i]];
        }

        return implode('', $array);
    }

    /**
     * Generate a simple memorable password (easier to read/type).
     * Format: Adjective-Noun-Number-Symbol (e.g., HappyCat-7#)
     *
     * @param bool $includeNumber Include a number (default: true)
     * @param bool $includeSymbol Include a symbol (default: true)
     * @return string A memorable password
     */
    public static function memorable(
        bool $includeNumber = true,
        bool $includeSymbol = true
    ): string {
        $adjectives = [
            'Happy', 'Bright', 'Swift', 'Clever', 'Brave', 'Calm', 'Eager', 'Fancy',
            'Gentle', 'Jolly', 'Kind', 'Lively', 'Nice', 'Proud', 'Silly', 'Witty',
            'Alert', 'Cool', 'Fine', 'Good', ' Keen', 'Lucky', 'Merry', 'Noble',
            'Quick', 'Sharp', 'Top', 'Warm', 'Young', 'Zesty', 'Bold', 'Fine',
        ];

        $nouns = [
            'Cat', 'Dog', 'Fox', 'Bear', 'Lion', 'Wolf', 'Hawk', 'Eagle',
            'Tree', 'Leaf', 'Flower', 'River', 'Mountain', 'Ocean', 'Star', 'Moon',
            'Sun', 'Cloud', 'Rain', 'Snow', 'Wind', 'Fire', 'Water', 'Earth',
            'Book', 'Pen', 'Desk', 'Chair', 'Table', 'Lamp', 'Clock', 'Phone',
            'Car', 'Bus', 'Train', 'Plane', 'Ship', 'Boat', 'Bike', 'Road',
        ];

        $adjective = $adjectives[random_int(0, count($adjectives) - 1)];
        $noun = $nouns[random_int(0, count($nouns) - 1)];
        $password = $adjective . $noun;

        if ($includeNumber) {
            $password .= random_int(1, 99);
        }

        if ($includeSymbol) {
            $symbols = ['!', '@', '#', '$', '%', '&', '*', '+', '='];
            $password .= $symbols[random_int(0, count($symbols) - 1)];
        }

        return $password;
    }

    /**
     * Generate a numeric PIN code.
     *
     * @param int $digits The number of digits (default: 6)
     * @return string The generated PIN
     */
    public static function pin(int $digits = 6): string
    {
        $pin = '';
        for ($i = 0; $i < $digits; $i++) {
            $pin .= random_int(0, 9);
        }
        return $pin;
    }

    /**
     * Generate a random API key.
     *
     * @param int $length The length of the key (default: 32)
     * @return string The generated API key
     */
    public static function apiKey(int $length = 32): string
    {
        $key = bin2hex(random_bytes($length / 2));
        return $length % 2 === 0 ? $key : $key . bin2hex(random_bytes(1));
    }

    /**
     * Generate a random token for email verification, password reset, etc.
     *
     * @param int $length The length of the token (default: 64)
     * @return string The generated token
     */
    public static function token(int $length = 64): string
    {
        return bin2hex(random_bytes($length / 2));
    }
}

