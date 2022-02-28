function ASCII(number)
{
    var top = [], mid = [], bot = [];
    let number_string = number.toString()

    for (let n = 0; number_string.charAt(n) != ''; n++) {
        console.log(n)
    }




    console.log(top + '\n' + mid + '\n' + bot)
}

function draw_number(number)
{
    switch (number){
        case '0':
            top.push(' _ ')
            mid.push('| |')
            bot.push('|_|')
            break;
        case '1':
            top.push('   ')
            mid.push('  |')
            bot.push('  |')
        break;
        case '2':
            top.push('  |')
            mid.push('  |')
            bot.push('  |')
        break;
        case '3':
            top.push('  |')
            mid.push('  |')
            bot.push('  |')
        break;
        case '4':
            top.push('  |')
            mid.push('  |')
            bot.push('  |')
        break;
        case '5':
            top.push('  |')
            mid.push('  |')
            bot.push('  |')
        break;
        case '6':
            top.push('  |')
            mid.push('  |')
            bot.push('  |')
        break;
        case '7':
            top.push('  |')
            mid.push('  |')
            bot.push('  |')
        break;
        case '8':
            top.push('  |')
            mid.push('  |')
            bot.push('  |')
        break;
        case '9':
            top.push('  |')
            mid.push('  |')
            bot.push('  |')
        break;

    }
}

ASCII(241243)