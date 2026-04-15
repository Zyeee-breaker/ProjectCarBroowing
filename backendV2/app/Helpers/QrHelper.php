<?php

namespace App\Helpers;

class QrHelper
{
    public static function generate($user, $car)
    {
        $userPart = $user->id . self::stringToNumber($user->name);
        $carPart = self::stringToNumber($car->model . $car->brand . $car->plate_number);

        return $userPart . $carPart . time();
    }

    private static function stringToNumber($string)
    {
        $result = '';
        foreach (str_split($string) as $char) {
            $result .= ord($char);
        }
        return $result;
    }
}